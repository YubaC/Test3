import argparse
import asyncio
import json
from pathlib import Path
from typing import Any

from graphrag.config.embeddings import entity_description_embedding
from graphrag.config.load_config import load_config
from graphrag.data_model.data_reader import DataReader
from graphrag.query.context_builder.conversation_history import ConversationHistory
from graphrag.query.factory import get_local_search_engine
from graphrag.query.indexer_adapters import (
    read_indexer_covariates,
    read_indexer_entities,
    read_indexer_relationships,
    read_indexer_reports,
    read_indexer_text_units,
)
from graphrag.utils.api import get_embedding_store, load_search_prompt
from graphrag_storage import create_storage
from graphrag_storage.tables.table_provider_factory import create_table_provider


def _read_output_tables(root_dir: Path, data_dir: Path | None):
    cli_overrides: dict[str, Any] = {}
    if data_dir is not None:
        cli_overrides["output_storage"] = {"base_dir": str(data_dir)}

    config = load_config(root_dir=root_dir, cli_overrides=cli_overrides)

    storage_obj = create_storage(config.output_storage)
    table_provider = create_table_provider(config.table_provider, storage=storage_obj)
    reader = DataReader(table_provider)

    communities = asyncio.run(reader.communities())
    community_reports = asyncio.run(reader.community_reports())
    text_units = asyncio.run(reader.text_units())
    relationships = asyncio.run(reader.relationships())
    entities = asyncio.run(reader.entities())

    covariates = None
    if asyncio.run(table_provider.has("covariates")):
        covariates = asyncio.run(reader.covariates())

    return config, entities, communities, community_reports, text_units, relationships, covariates


def main():
    parser = argparse.ArgumentParser(
        description="Dump the exact LocalSearch LLM input payload before answer generation."
    )
    parser.add_argument("query", help="User query text")
    parser.add_argument("--root", "-r", default=".", help="Project root")
    parser.add_argument("--data", "-d", default=None, help="Index output directory")
    parser.add_argument("--community-level", type=int, default=2, help="Community level")
    parser.add_argument(
        "--response-type",
        default="Multiple Paragraphs",
        help="Response type template value",
    )
    parser.add_argument(
        "--out",
        default="logs/local_llm_input.json",
        help="Where to write the full request payload",
    )
    parser.add_argument(
        "--context-out",
        default="logs/local_context_chunks.txt",
        help="Where to write the raw context chunk string",
    )
    args = parser.parse_args()

    root_dir = Path(args.root).resolve()
    data_dir = Path(args.data).resolve() if args.data else None

    (
        config,
        entities_df,
        communities_df,
        reports_df,
        text_units_df,
        relationships_df,
        covariates_df,
    ) = _read_output_tables(root_dir, data_dir)

    entities = read_indexer_entities(entities_df, communities_df, args.community_level)
    reports = read_indexer_reports(reports_df, communities_df, args.community_level)
    text_units = read_indexer_text_units(text_units_df)
    relationships = read_indexer_relationships(relationships_df)
    covariates = read_indexer_covariates(covariates_df) if covariates_df is not None else []

    description_embedding_store = get_embedding_store(
        config=config.vector_store,
        embedding_name=entity_description_embedding,
    )

    prompt = load_search_prompt(config.local_search.prompt)

    search_engine = get_local_search_engine(
        config=config,
        reports=reports,
        text_units=text_units,
        entities=entities,
        relationships=relationships,
        covariates={"claims": covariates},
        description_embedding_store=description_embedding_store,
        response_type=args.response_type,
        system_prompt=prompt,
    )

    context_result = search_engine.context_builder.build_context(
        query=args.query,
        conversation_history=ConversationHistory.from_list([]),
        **search_engine.context_builder_params,
    )

    context_chunks = context_result.context_chunks
    system_prompt = search_engine.system_prompt.format(
        context_data=context_chunks,
        response_type=search_engine.response_type,
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": args.query},
    ]

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(
            {
                "query": args.query,
                "response_type": search_engine.response_type,
                "context_tokens": len(search_engine.tokenizer.encode(context_chunks)),
                "system_prompt_tokens": len(search_engine.tokenizer.encode(system_prompt)),
                "messages": messages,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    context_out_path = Path(args.context_out)
    context_out_path.parent.mkdir(parents=True, exist_ok=True)
    context_out_path.write_text(str(context_chunks), encoding="utf-8")

    print(f"wrote: {out_path}")
    print(f"wrote: {context_out_path}")
    print(f"context_tokens={len(search_engine.tokenizer.encode(context_chunks))}")
    print(f"system_prompt_tokens={len(search_engine.tokenizer.encode(system_prompt))}")


if __name__ == "__main__":
    main()

import { OpenAPIV3 } from 'openapi-types';
import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import { CTX, Schema } from './types';
import APIStateHub from './api-state-hub';
import { LocalStateHub } from './use-local-state';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiDoc: OpenAPIV3.Document;
}

function Render({ schema, rootEle, apiDoc }: RenderSchemaParams): void {
  const instantiatedSchema = deserializeSchema(schema);
  if (!instantiatedSchema) {
    // TODO: paint error
    return;
  }

  const apiStateHub = new APIStateHub(apiDoc, instantiatedSchema.apiStateSpec);
  // todo render localStateSpec from schema
  const localStateHub = new LocalStateHub({});

  apiStateHub.initContext(localStateHub);
  localStateHub.initContext(apiStateHub);

  const ctx: CTX = {
    apiStateContext: apiStateHub,
    localStateContext: localStateHub,
  };

  renderSchema({ schema: instantiatedSchema, ctx, rootEle });
}

export default Render;

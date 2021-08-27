import { RequestParams } from '@ofa/spec-interpreter/src/types';
import StateHub from './state-hub';

declare enum ISRawSchema {
  YES = 'yes',
  NO = 'no',
}

export type APIState = {
  params: RequestParams;
  loading: boolean;
  data?: any;
  error?: Error;
};

type ConstantProperty = {
  type: 'constant_property';
  value: any;
}

type FunctionSpec = {
  type: string;
  args: string;
  body: string;
}

export type APIStateConvertorFuncSpec = FunctionSpec & {
  type: 'api_derive_function';
  arguments: 'apiState';
};

export type APIInvokeConvertorFuncSpec = FunctionSpec & {
  type: 'api_invoke_convertor_function';
}

export type APIInvokeCallbackFuncSpec = FunctionSpec & {
  type: 'api_invoke_call_function';
  arguments: 'state';
}

export type FunctionSpecs =
  APIStateConvertorFuncSpec |
  APIInvokeConvertorFuncSpec |
  APIInvokeCallbackFuncSpec;

type APIStateConvertor<T> = T extends ISRawSchema.YES ?
  APIStateConvertorFuncSpec :
  (apiState: APIState) => any;

type APIInvokeConvertor<T> = T extends ISRawSchema.YES ?
  APIInvokeConvertorFuncSpec :
  (...args: any[]) => RequestParams;

type APIInvokeCallBack<T> = T extends ISRawSchema.YES ?
  APIInvokeCallbackFuncSpec :
  (apiState: APIState) => void;

export type APIDerivedProperty<T> = {
  type: 'api_derived_property';
  initialValue: any;
  stateID: string;
  convertor?: APIStateConvertor<T>;
}

export type APIInvokeProperty<T> = {
  type: 'api_invoke_property';
  stateID: string;
  convertor: APIInvokeConvertor<T>;
  onSuccess?: APIInvokeCallBack<T>;
  onError?: APIInvokeCallBack<T>;
}

export type NodeProp<T> =
  ConstantProperty |
  APIDerivedProperty<T> |
  APIInvokeProperty<T> |
  Array<APIInvokeProperty<T>>;

export type NodeProps<T> = Record<string, NodeProp<T>>;

interface BaseNode<T> {
  key: string;
  type: 'html-element' | 'react-component';
  props?: NodeProps<T>;
  children?: BaseNode<T>[];
}

interface HTMLNode<T> extends BaseNode<T> {
  type: 'html-element';
  name: string;
  children?: Array<SchemaNode<T>>;
}

interface ReactComponentNode<T> extends BaseNode<T> {
  type: 'react-component';
  packageName: string;
  packageVersion: string;
  exportName: 'default' | string;
  // not recommend, should avoid
  // subModule?: string;
  children?: Array<SchemaNode<T>>;
}

type SchemaNode<T> = HTMLNode<T> | ReactComponentNode<T>;

export type StatesMap = Record<string, {
  operationID: string;
  [key: string]: any;
}>;

export type Schema<T extends ISRawSchema> = {
  node: SchemaNode<T>;
  statesMap: StatesMap;
}

export type RawSchema = {
  node: SchemaNode<ISRawSchema.YES>;
  statesMap: StatesMap;
};

export type EvaluatedSchema = {
  node: SchemaNode<ISRawSchema.NO>;
  statesMap: StatesMap;
};

interface Document {
  adoptedStyleSheets: any[];
}

type DynamicComponent = React.FC<any> | React.ComponentClass<any>;

type LocalStateProp = {
  type: 'local';
  default: any;
}

declare global {
  interface Window {
    stateHub: StateHub;
  }
}

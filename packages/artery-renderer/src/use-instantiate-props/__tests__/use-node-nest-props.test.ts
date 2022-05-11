import { renderHook } from '@testing-library/react-hooks/pure';
import ArterySpec from '@one-for-all/artery';

import useNodeNestProps from '../use-node-nest-props';

import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import { ArteryNode } from '../../types';
import deserialize from '../../boot-up/deserialize';

test('useNodeNestProps_resolve_expected_value', () => {
  const node: ArterySpec.Node = {
    id: 'whatever',
    type: 'html-element',
    name: 'whatever',
    props: {
      normalProp: {
        type: 'constant_property',
        value: 100,
      },
      nestProps: {
        type: 'node_nest_property',
        value: {
          constant: {
            type: 'constant_property',
            value: 'this is a constant_property',
          },
          func: {
            type: 'functional_property',
            func: {
              type: '',
              args: '...args',
              body: 'console.log("this is a functional_property")',
            },
          },
        },
      },
    },
  };
  const arteryNode: ArteryNode = deserialize(node, undefined) as ArteryNode;

  const { result, unmount } = renderHook(() => useNodeNestProps(arteryNode, dummyCTX));

  const { nestProps } = result.current;
  // @ts-ignore
  expect(nestProps.constant).toEqual('this is a constant_property');
  // @ts-ignore
  expect(nestProps.func).toBeInstanceOf(Function);

  unmount();
});

test('useNodeNestPropsArrays_resolve_expected_value', () => {
  const node: ArterySpec.Node = {
    id: 'whatever',
    type: 'html-element',
    name: 'whatever',
    props: {
      normalProp: {
        type: 'constant_property',
        value: 100,
      },
      nestProps: {
        type: 'node_nest_property',
        value: [
          {
            constant: {
              type: 'constant_property',
              value: 'this is a constant_property',
            },
            func: {
              type: 'functional_property',
              func: {
                type: '',
                args: '...args',
                body: 'return "this is a functional_property1"',
              },
            },
          },
          {
            constant: {
              type: 'constant_property',
              value: 'this is a constant_property2',
            },
            func: {
              type: 'functional_property',
              func: {
                type: '',
                args: '...args',
                body: 'return "this is a functional_property2"',
              },
            },
          },
        ],
      },
    },
  };
  const arteryNode: ArteryNode = deserialize(node, undefined) as ArteryNode;

  const { result, unmount } = renderHook(() => useNodeNestProps(arteryNode, dummyCTX));

  const { nestProps } = result.current;
  // @ts-ignore
  expect(nestProps[0].constant).toEqual('this is a constant_property');
  // @ts-ignore
  expect(nestProps[0].func).toBeInstanceOf(Function);

  // @ts-ignore
  expect(nestProps[1].constant).toEqual('this is a constant_property2');
  // @ts-ignore
  expect(nestProps[1].func).toBeInstanceOf(Function);

  unmount();
});

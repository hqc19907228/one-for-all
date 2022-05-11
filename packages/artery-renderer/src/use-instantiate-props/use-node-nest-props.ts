import { CTX, ArteryNode, NodeProperties, NodeNestProperty } from '../types';
import useInstantiateProps from './';

function getProperties(properties: NodeProperties, ctx: CTX): Record<string, unknown> {
  const dummyNode: ArteryNode = {
    type: 'html-element',
    id: 'placeholder-node',
    name: 'whatever',
    props: properties,
  };
  return useInstantiateProps(dummyNode, ctx);
}

export default function useNodeNestProps(
  node: ArteryNode,
  ctx: CTX,
): Record<string, unknown> {
  if (!node.props) {
    return {};
  }

  return Object.entries(node.props)
    .filter((pair): pair is [string, NodeNestProperty] => {
      return pair[1].type === 'node_nest_property';
    })
    .reduce<Record<string, unknown>>((acc, [key, { value }]) => {
      let prop;
      if (Array.isArray(value)) {
        prop = value.map((properties) => getProperties(properties, ctx));
      } else {
        prop = getProperties(value, ctx);
      }
      return {
        ...acc,
        [key]: prop
      };
    }, {});
}

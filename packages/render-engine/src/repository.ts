import { DynamicComponent } from './types';

type ComponentURLResolver = (componentName: string, version?: string) => string;
// TODO: support import const value and prune functions
type Importer = (systemModule: System.Module, componentName: string, version?: string) => DynamicComponent;

export type RegistryOptions = {
  componentURLResolver: ComponentURLResolver;
  importer?: Importer;
  injectDependencies?: () => Promise<boolean>;
}

// function defaultImporter(systemModule: System.Module): unknown {
//   return systemModule.default;
// }

const repository: Record<string, RegistryOptions> = {};

// register a components namespace
export function register(nameSpace: string, options: RegistryOptions): void {
  repository[nameSpace] = options;
}

// function resolveComponentPath(componentName: string, version: string) {
//   // render import-map.json
//   return `/packages/${componentName}/dist/index.js`;
// }

type ImportComponentParams = {
  packageName: string;
  version: string;
  exportName?: string;
}

export function importComponent(
  { packageName, exportName }: ImportComponentParams,
): Promise<DynamicComponent> {
  return System.import(packageName).then((systemModule) => {
    return systemModule[exportName || 'default'];
  });
}

// TODO: component name should be lower case
export function getBasicComponentsOptions(): RegistryOptions {
  return {
    componentURLResolver: (_, version): string => {
      return `/dist/bundle@${version}.js`;
    },
    importer: (systemModule, componentName): DynamicComponent => {
      // TODO: check module is undefined
      return systemModule[componentName];
    },
  };
}

export function getAdvancedComponentsOptions(): RegistryOptions {
  return {
    componentURLResolver: (componentName, version): string => {
      const fragments = componentName.split('/');

      if (fragments.length === 1) {
        return `/dist/advanced-components/${fragments[0]}@${version}/index.js`;
      }

      const mainComponentName = fragments.shift();
      fragments.unshift(`${mainComponentName}@${version}`);

      return `/dist/advanced-components/${fragments.join('/')}.js`;
    },
  };
}

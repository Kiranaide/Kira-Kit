import type { RegistryItem, Registry } from "../types";

const REGISTRY_BASE_URL = "https://kira-kit.vercel.app/r";

export async function fetchRegistryItem(
  componentName: string
): Promise<RegistryItem | null> {
  const url = `${REGISTRY_BASE_URL}/${componentName}.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as RegistryItem;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Unable to fetch from ${url}. Make sure you're connected to the internet.`
      );
    }
    throw error;
  }
}

export async function fetchRegistryIndex(): Promise<{
  name: string;
  homepage: string;
  components: Array<{
    name: string;
    title: string;
    dependencies: string[];
    registryDependencies: string[];
  }>;
}> {
  const url = `${REGISTRY_BASE_URL}/index.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch registry index: ${response.statusText}`);
  }

  const data = await response.json();
  return data as {
    name: string;
    homepage: string;
    components: Array<{
      name: string;
      title: string;
      dependencies: string[];
      registryDependencies: string[];
    }>;
  };
}

export async function fetchAllRegistries(): Promise<RegistryItem[]> {
  const index = await fetchRegistryIndex();

  const items: RegistryItem[] = [];

  for (const component of index.components) {
    const item = await fetchRegistryItem(component.name);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

import type { RegistryItem } from "../types";

import { getRegistryUrl } from "./config";

export async function fetchRegistryItem(
  componentName: string,
  cwd: string = process.cwd(),
): Promise<RegistryItem | null> {
  const registryUrl = getRegistryUrl(cwd);
  const url = `${registryUrl}/${componentName}.json`;

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
        `Unable to fetch from ${url}. Make sure you're connected to the internet.`,
      );
    }
    throw error;
  }
}

export async function fetchRegistryIndex(cwd: string = process.cwd()): Promise<{
  name: string;
  homepage: string;
  components: Array<{
    name: string;
    title: string;
    dependencies: string[];
    registryDependencies: string[];
  }>;
}> {
  const registryUrl = getRegistryUrl(cwd);
  const url = `${registryUrl}/index.json`;

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

export async function fetchAllRegistries(
  cwd: string = process.cwd(),
): Promise<RegistryItem[]> {
  const index = await fetchRegistryIndex(cwd);

  const items: RegistryItem[] = [];

  for (const component of index.components) {
    const item = await fetchRegistryItem(component.name, cwd);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

import { BlinkKey, Table } from "../../core";
import { And } from "../types";
import { selectOrFilterItems } from "./or";
import { selectWhereFilterItems } from "./where";

/**
 * Select all items for `filter`.
 *
 * @returns the selected items from the database, or `null` in case a full table scan is required.
 */
export async function selectAndFilterItems<T, P extends keyof T>(
  table: Table<T, P>,
  filter: And<T>
): Promise<T[] | null> {
  if (filter.$and.length === 0) {
    return [];
  }

  if (filter.$and.length === 1) {
    const childFilter = filter.$and[0];
    return "$or" in childFilter
      ? await selectOrFilterItems(table, childFilter)
      : await selectWhereFilterItems(table, childFilter);
  }

  // Fill array with items of first filter
  const firstChildFilter = filter.$and[0];
  let filterItems =
    "$or" in firstChildFilter
      ? await selectOrFilterItems(table, firstChildFilter)
      : await selectWhereFilterItems(table, firstChildFilter);

  if (filterItems !== null) return filterItems;

  // Iterate over all items from the other filters and delete from map
  for (let childFilter of filter.$and.slice(1)) {
    filterItems =
      "$or" in childFilter
        ? await selectOrFilterItems(table, childFilter)
        : await selectWhereFilterItems(table, childFilter);

    if (filterItems !== null) return filterItems;
  }

  return filterItems;
}

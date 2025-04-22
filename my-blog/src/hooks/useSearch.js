import { useOutletContext } from "react-router-dom";

export function useSearch() {
  return useOutletContext();
}

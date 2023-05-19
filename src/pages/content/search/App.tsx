import useShow from "./hooks/useShow";
import Search from "./Search";

export default function App() {
  const { show, closeSearch } = useShow();

  return <>{show && <Search closeSearch={closeSearch} />}</>;
}

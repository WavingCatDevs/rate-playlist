import { useRouter } from "next/router";
import musicGenres from "../../res/genres.json";

const GenrePage = () => {
  const router = useRouter();
  const { genre } = router.query;
  const genreItems = musicGenres[genre as string] || [];

  return (
    <div>
      <h1>{genre}</h1>
      <ul>
        {genreItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default GenrePage;

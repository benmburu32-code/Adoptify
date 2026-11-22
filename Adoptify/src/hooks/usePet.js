export function usePet(id) {
  const [pet, setPet] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPet() {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, "pets", id));
        if (docSnap.exists()) {
          setPet({ id: docSnap.id, ...docSnap.data() });
          setNotFound(false);
          setError(null);
        } else {
          setNotFound(true);   // ← the page's notFound UI is fed by this
          setPet(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [id]);

  return { pet, notFound, loading, error };
}
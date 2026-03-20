import { useWishlist } from "../context/WishlistContext";

const useFavorites = () => {
  return useWishlist();
};

export default useFavorites;
import PromoBar from "./PromoBar";
import ShopNavbar from "./ShopNavbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <PromoBar />
      <ShopNavbar />
    </header>
  );
}

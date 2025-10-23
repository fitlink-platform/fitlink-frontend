// src/pages/CustomerPage.jsx
import HeroCarousel from "~/components/HeroCarousel";
import MainLayout from "~/layouts/MainLayout";
import BMIFloatingButton from "~/components/student/BMIFloatingButton";
export default function CustomerPage() {
  return (
    <MainLayout>
      <HeroCarousel />
      <BMIFloatingButton />
    </MainLayout>
  );
}

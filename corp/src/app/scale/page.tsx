import Hero from "@/components/hero";
import scaleImage from "/public/scale.jpg";

export default function ScalePage() {
  return (
    <>
      <Hero
        imgData={scaleImage}
        imgAlt="steel factory"
        title="Scale your app to infinity."
      />
    </>
  );
}

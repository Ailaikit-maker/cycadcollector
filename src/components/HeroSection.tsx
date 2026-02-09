import heroCycad from "@/assets/hero-cycad.jpg";

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <img
        src={heroCycad}
        alt="Lush cycad garden"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-primary-foreground md:text-7xl">
          Cycad Collector
        </h1>
        <p className="mb-8 max-w-xl text-lg text-primary-foreground/80 md:text-xl">
          Catalogue and manage your living fossil collection with ease.
        </p>
        <button
          onClick={onGetStarted}
          className="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

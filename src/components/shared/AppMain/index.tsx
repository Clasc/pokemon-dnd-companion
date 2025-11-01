const AppMain = ({
  children,
  title,
  subTitle,
}: {
  children?: React.ReactNode;
  title: string;
  subTitle?: string;
}) => {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {subTitle && (
          <p className="text-gray-300 text-sm md:text-base">{subTitle}</p>
        )}
      </header>
      {children}
    </main>
  );
};

export default AppMain;

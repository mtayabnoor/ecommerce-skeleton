function ProductPrice({ value }: { value: number }) {
  const [dollars, cents] = value.toFixed(2).split('.');
  return (
    <p>
      <span className="text-xl">$</span>
      <span className="text-xl font-bold tracking-tight">{dollars}</span>
      <span className="text-xs align-super">.{cents}</span>
    </p>
  );
}

export { ProductPrice };

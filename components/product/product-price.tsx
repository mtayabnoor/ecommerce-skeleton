function ProductPrice({ value }: { value: number | string }) {
  const [dollars, cents] = Number(value).toFixed(2).split('.');
  return (
    <p>
      <span className="text-xl">$</span>
      {dollars}
      <span className="text-sm">.{cents}</span>
    </p>
  );
}

export { ProductPrice };

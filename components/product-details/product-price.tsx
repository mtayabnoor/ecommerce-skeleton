function ProductPrice({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) {
  const [dollars, cents] = Number(value).toFixed(2).split('.');
  return (
    <p className={className}>
      <span className="text-sm align-super">$</span>
      <span className="text-xl">{dollars}</span>
      <span className="text-sm align-super">.{cents}</span>
    </p>
  );
}

export { ProductPrice };

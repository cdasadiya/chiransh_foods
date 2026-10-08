import { foodImageProps } from "@/lib/images";

export default function FoodImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 640px",
  ...rest
}) {
  const image = foodImageProps(src);
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}

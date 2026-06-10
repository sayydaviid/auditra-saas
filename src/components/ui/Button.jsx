export default function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon: Icon,
  className = '',
  ...props
}) {
  const componentProps = Component === 'button' ? { type } : {};

  return (
    <Component className={`btn btn-${variant} btn-${size} ${className}`} {...componentProps} {...props}>
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </Component>
  );
}

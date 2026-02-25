import styled, { css } from "styled-components";

const variants = {
  primary: css`
    background: var(--color-primary);
    color: white;
    border: 1px solid var(--color-primary);
    &:hover:not(:disabled) { background: #374151; border-color: #374151; }
  `,
  secondary: css`
    background: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-border-dark);
    &:hover:not(:disabled) { border-color: var(--color-primary); }
  `,
  accent: css`
    background: var(--color-accent);
    color: white;
    border: 1px solid var(--color-accent);
    &:hover:not(:disabled) { background: var(--color-accent-dark); }
  `,
  danger: css`
    background: var(--color-danger);
    color: white;
    border: 1px solid var(--color-danger);
    &:hover:not(:disabled) { background: #b91c1c; }
  `,
  ghost: css`
    background: transparent;
    color: var(--color-text-muted);
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: var(--color-bg-secondary); color: var(--color-text); }
  `,
};

const sizes = {
  sm: css`padding: 0.4rem 0.75rem; font-size: var(--font-size-sm);`,
  md: css`padding: 0.65rem 1.1rem; font-size: var(--font-size-md);`,
  lg: css`padding: 0.85rem 1.75rem; font-size: var(--font-size-md);`,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: var(--transition);
  white-space: nowrap;
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
`;

const Button = ({ children, variant = "primary", size = "md", fullWidth = false, ...props }) => (
  <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
    {children}
  </StyledButton>
);

export default Button;
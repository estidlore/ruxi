type Context<T> = React.Context<T | null>;

type Container = (props: ContainerProps) => JSX.Element;

interface ContainerProps {
  children: React.ReactNode;
}

export type { Context, Container, ContainerProps };

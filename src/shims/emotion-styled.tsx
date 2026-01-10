import React from 'react';

type StyledComponentProps = { as?: React.ElementType } & Record<string, any>;

type StyledComponent = React.ForwardRefExoticComponent<StyledComponentProps & React.RefAttributes<any>>;

type StyledFactory = (component: React.ElementType) => (styles?: any) => StyledComponent;

const styled: StyledFactory = (component: React.ElementType) => (_styles?: any) => {
  const Styled = React.forwardRef<any, StyledComponentProps>(({ as, ...rest }, ref) => {
    const Element = as || component;
    return <Element ref={ref} {...rest} />;
  });
  Styled.displayName = `Styled(${typeof component === 'string' ? component : component.displayName || component.name || 'Component'})`;
  return Styled;
};

export default Object.assign(styled, { default: styled });

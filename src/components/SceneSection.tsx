import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { HorizonCitySvg } from './icons';

export interface SkyTone {
  top: string;
  bottom: string;
  dark?: boolean;
  sunset?: boolean;
}

export function SceneSection({
  tone,
  className = '',
  style,
  children,
  ...rest
}: {
  tone: SkyTone;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'style' | 'className'>) {
  return (
    <section
      data-pup-scene="true"
      data-tone={tone.dark ? 'dark' : 'light'}
      className={`tp-scene ${className}`}
      style={{ '--sky-top': tone.top, '--sky-bottom': tone.bottom, ...style } as CSSProperties}
      {...rest}
    >
      {children}
      {tone.sunset && (
        <div aria-hidden="true" className="tp-horizon">
          <span className="tp-horizon__sun" />
          <HorizonCitySvg className="tp-horizon__city" />
        </div>
      )}
    </section>
  );
}

import { cn } from '@/utils/helpers';

export default function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white shadow-card ring-1 ring-gray-100',
        hover && 'transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

import * as React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<string,string> = {
	default: 'bg-foreground text-background hover:opacity-90',
	outline: 'border border-foreground/30 hover:bg-foreground/5',
	ghost: 'hover:bg-foreground/10'
};

const sizeClasses: Record<string,string> = {
	sm: 'h-8 px-3 text-xs',
	md: 'h-10 px-4 text-sm',
	lg: 'h-12 px-6 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant='default', size='md', ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn('inline-flex items-center justify-center rounded font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground', variantClasses[variant], sizeClasses[size], className)}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export default Button;

import * as React from 'react';
import { cn } from './utils';

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('rounded border border-foreground/15 bg-background shadow-sm p-4', className)} {...props} />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('mb-2 flex flex-col gap-1', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h2 className={cn('text-lg font-semibold', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('text-sm flex flex-col gap-2', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('mt-4 flex items-center justify-end gap-2', className)} {...props} />
);

export default Card;

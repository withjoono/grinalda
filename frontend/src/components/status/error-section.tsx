interface ErrorSectionProps {
    text?: string;
    onRetry?: () => void;
}

export function ErrorSection({ text = '오류가 발생했습니다.', onRetry }: ErrorSectionProps) {
    return (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
            <p className='text-4xl pb-4'>⚠️</p>
            <p className='text-lg font-semibold text-muted-foreground'>{text}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className='mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90'
                >
                    다시 시도
                </button>
            )}
        </div>
    );
}

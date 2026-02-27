import AppNav from './app-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='mx-auto max-w-5xl px-4 py-6'>
            <AppNav />
            <div className='mt-6'>{children}</div>
        </div>
    );
}

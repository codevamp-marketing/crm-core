import { Suspense } from 'react'
import { Loader } from 'lucide-react'

import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <Suspense fallback={<Loader className="animate-spin" />}>
            <LoginForm />
        </Suspense>
    )
}

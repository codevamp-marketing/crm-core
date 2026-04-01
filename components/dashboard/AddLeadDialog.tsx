'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLead } from '@/hooks/use-leads';
import { getCookie, decodeJwt } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

const COURSES = {
    UG: ['B.Tech', 'B.Pharma', 'BBA', 'BCA'],
    PG: ['MBA', 'MCA'],
    OTHERS: ['Diploma (Poly)', 'D.Pharma', 'Ph.D'],
};

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    course: z.string().min(1, 'Please select a course'),
    specialization: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddLeadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const createLead = useCreateLead();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            course: '',
            specialization: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        const token = getCookie('token');
        const decoded = decodeJwt(token);
        const createdBy = decoded?.sub;

        createLead.mutate(
            {
                name: values.name,
                email: values.email,
                phone: values.phone,
                course: values.course,
                specialization: values.specialization || undefined,
                source: 'Manual',
                createdBy,
            },
            {
                onSuccess: () => {
                    form.reset();
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) form.reset();
                onOpenChange(isOpen);
            }}
        >
            <DialogContent
                className="sm:max-w-[500px] p-6 lg:p-8 border-zinc-200 dark:border-zinc-800 shadow-xl"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <button
                    type="button"
                    onClick={() => {
                        form.reset();
                        onOpenChange(false);
                    }}
                    className="absolute right-4 top-4 p-2 rounded-full text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                </button>
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Enquiry Now</DialogTitle>
                    <DialogDescription className="sr-only">
                        Get course details instantly.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100 ml-[3px]">Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-50 border-zinc-200 dark:bg-[#151b28] dark:border-[#2a3441] focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl px-4 py-3 h-auto shadow-sm transition-colors text-zinc-900 dark:text-zinc-100"
                                                placeholder="Enter your full name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100 ml-[2px]">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-50 border-zinc-200 dark:bg-[#151b28] dark:border-[#2a3441] focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl px-4 py-3 h-auto shadow-sm transition-colors text-zinc-900 dark:text-zinc-100"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100 ml-[2px]">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-50 border-zinc-200 dark:bg-[#151b28] dark:border-[#2a3441] focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl px-4 py-3 h-auto shadow-sm transition-colors text-zinc-900 dark:text-zinc-100"
                                                placeholder="Enter your phone number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100 ml-[2px]">Select Course</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-50 border-zinc-200 dark:bg-[#151b28] dark:border-[#2a3441] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 h-auto shadow-sm transition-colors text-zinc-900 dark:text-zinc-100">
                                                    <SelectValue placeholder="Select course..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[250px] overflow-y-auto border-zinc-200 dark:border-[#2a3441] dark:bg-[#151b28]">
                                                <SelectGroup>
                                                    <SelectLabel className="text-indigo-600 dark:text-indigo-400">UG PROGRAMS</SelectLabel>
                                                    {COURSES.UG.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectLabel className="text-indigo-600 dark:text-indigo-400">PG PROGRAMS</SelectLabel>
                                                    {COURSES.PG.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectLabel className="text-indigo-600 dark:text-indigo-400">OTHERS</SelectLabel>
                                                    {COURSES.OTHERS.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="specialization"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100 ml-[2px]">Specialization / Stream</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-zinc-50 border-zinc-200 dark:bg-[#151b28] dark:border-[#2a3441] focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl px-4 py-3 h-auto shadow-sm transition-colors text-zinc-900 dark:text-zinc-100"
                                            placeholder="Preferred Specialization (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 mt-8">
                            <Button
                                type="button"
                                className="flex-1 font-semibold py-6 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:hover:text-red-300 transition-colors shadow-sm cursor-pointer"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                                disabled={createLead.isPending}
                            >
                                {createLead.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Add Lead
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

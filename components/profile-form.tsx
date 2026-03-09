'use client';

import { useActionState } from 'react';
import { updateUserAction } from '@/lib/server-actions/actions/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useEffect } from 'react';

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentMethod: string | null;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null;
};

export function ProfileForm({ user }: { user: UserData }) {
  const [state, formAction, isPending] = useActionState(updateUserAction, {
    success: false,
    message: '',
    fields: {},
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>

        <form action={formAction}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={user.firstName}
                      placeholder="John"
                      required
                    />
                    {state.fields?.firstName && (
                      <p className="text-sm text-destructive">
                        {state.fields.firstName[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={user.lastName}
                      placeholder="Doe"
                      required
                    />
                    {state.fields?.lastName && (
                      <p className="text-sm text-destructive">
                        {state.fields.lastName[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed from the profile.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
                  <Input
                    id="paymentMethod"
                    name="paymentMethod"
                    defaultValue={user.paymentMethod || ''}
                    placeholder="e.g. Credit Card, PayPal"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>
                  Manage your default shipping destination.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    name="line1"
                    defaultValue={user.address?.line1 || ''}
                    placeholder="123 Main St"
                  />
                  {state.fields?.['address.line1'] && (
                    <p className="text-sm text-destructive">
                      {state.fields['address.line1'][0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    name="line2"
                    defaultValue={user.address?.line2 || ''}
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      defaultValue={user.address?.city || ''}
                      placeholder="New York"
                    />
                    {state.fields?.['address.city'] && (
                      <p className="text-sm text-destructive">
                        {state.fields['address.city'][0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      defaultValue={user.address?.state || ''}
                      placeholder="NY"
                    />
                    {state.fields?.['address.state'] && (
                      <p className="text-sm text-destructive">
                        {state.fields['address.state'][0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Zip / Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      defaultValue={user.address?.postalCode || ''}
                      placeholder="10001"
                    />
                    {state.fields?.['address.postalCode'] && (
                      <p className="text-sm text-destructive">
                        {state.fields['address.postalCode'][0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      defaultValue={user.address?.country || ''}
                      placeholder="United States"
                    />
                    {state.fields?.['address.country'] && (
                      <p className="text-sm text-destructive">
                        {state.fields['address.country'][0]}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}

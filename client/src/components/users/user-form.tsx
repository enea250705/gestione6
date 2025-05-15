import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@/types/schema";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Form schema - estendere lo schema esistente con validazione aggiuntiva
const userFormSchema = z.object({
  username: z.string().min(3, "Il nome utente deve essere di almeno 3 caratteri").max(50),
  password: z.string().min(6, "La password deve essere di almeno 6 caratteri").optional(),
  name: z.string().min(2, "Il nome deve essere di almeno 2 caratteri").max(100),
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  role: z.enum(["admin", "employee"]),
  isActive: z.boolean().default(true),
});

// Tipo per i valori del form
type UserFormValues = z.infer<typeof userFormSchema>;

type UserFormProps = {
  user?: User;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
};

export function UserForm({ user, onSubmit, onCancel, isEdit = false }: UserFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  // Prepara i valori di default
  const defaultValues: Partial<UserFormValues> = {
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    role: (user?.role as "admin" | "employee") || "employee",
    isActive: user?.isActive ?? true,
  };
  
  // Configura il form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Gestisce la validazione della password in base al contesto (creazione o modifica)
  const validatePassword = () => {
    const password = form.getValues("password");
    
    // Se è una modifica e la password è vuota, è ok (non verrà aggiornata)
    if (isEdit && (!password || password.length === 0)) {
      return true;
    }
    
    // Altrimenti verifica che la password sia valida
    if (!password || password.length < 6) {
      return "La password deve essere di almeno 6 caratteri";
    }
    
    return true;
  };
  
  const handleSubmit = (values: UserFormValues) => {
    // Se è una modifica e la password è vuota, rimuovila dai valori
    if (isEdit && (!values.password || values.password.length === 0)) {
      const { password, ...rest } = values;
      onSubmit(rest as UserFormValues);
    } else {
      onSubmit(values);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? "Modifica Utente" : "Nuovo Utente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome utente</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="nome.cognome" 
                      {...field} 
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormDescription>
                    Nome utente per il login (non può essere modificato dopo la creazione)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEdit ? "Nuova password (opzionale)" : "Password"}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder={isEdit ? "Lascia vuoto per non modificare" : "Password"} 
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormDescription>
                    {isEdit 
                      ? "Lascia vuoto per mantenere la password attuale" 
                      : "La password deve essere di almeno 6 caratteri"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Cognome" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome e cognome del dipendente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@esempio.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Email per le notifiche (opzionale)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ruolo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un ruolo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Amministratore</SelectItem>
                      <SelectItem value="employee">Dipendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Gli amministratori hanno accesso a tutte le funzionalità
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Stato account</FormLabel>
                    <FormDescription>
                      Attiva o disattiva l'accesso dell'utente
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button onClick={form.handleSubmit(handleSubmit)}>
          {isEdit ? "Aggiorna" : "Crea"} Utente
        </Button>
      </CardFooter>
    </Card>
  );
}
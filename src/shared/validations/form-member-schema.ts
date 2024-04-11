/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';
import { MaritalStatus, MemberRoles } from '@/shared/enums';

export const formMemberSchema = z
  .object({
    firstName: z.string({ required_error: 'xd'})
      .min(1, {message: 'El campo debe contener al menos 1 carácter.'})
      .max(40, {message: 'El campo debe contener máximo 40 caracteres'}),

    lastName: z.string()
      .min(1, {message: 'El campo debe contener al menos 1 carácter.'})
      .max(40, {message: 'El campo debe contener máximo 40 caracteres'}),
      

    originCountry: z.string()
      .min(1, {message: 'El campo debe contener al menos 1 carácter.'})
      .max(20, {message: 'El campo debe contener máximo 20 caracteres.'}),

    dateBirth: z.date({
      required_error: "Por favor selecciona una fecha.",
    }),

    gender: z.string(z.enum(['male', 'female'], {
      required_error: "Por favor seleccione una opción válida.",
    })).refine((value) => value !== undefined && value.trim() !== '',
      { message: "Por favor seleccione una opción válida." }
    ),

    maritalStatus: z.string( z.nativeEnum(MaritalStatus,{
      required_error: "Por favor seleccione una opción válida.",
    })).refine((value) => value !== undefined && value.trim() !== '',
      { message: "Por favor seleccione una opción válida." }
    ),

    numberChildren: z.string()
      .refine(numberChildren => !isNaN(parseInt(numberChildren)),
      { message: 'El campo debe contener un numero' }
    ),

    conversionDate: z.date({
      required_error: "Por favor selecciona una fecha.",
    }),

    emailAddress: z.string().email({ message: "Email invalido." }),

    phoneNumber: z.string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.'})
      .max(20, { message: 'El campo debe contener máximo 20 caracteres.' }),

    country: z.string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(20, { message: 'El campo debe contener máximo 20 caracteres.' }),

    department: z.string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(20, { message: 'El campo debe contener máximo 20 caracteres.' }),

    province: z.string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(20, { message: 'El campo debe contener máximo 20 caracteres.' }),

    district: z.string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(20, { message: 'El campo debe contener máximo 20 caracteres.' }),
      
    address: z.string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(50, { message: 'El campo debe contener máximo 50 caracteres.' }),

    roles: z.array(z.nativeEnum(MemberRoles),{
      required_error: "Debes seleccionar al menos un rol.",
    }).refine((value) => value.some((item) => item), {
      message: "Debes seleccionar al menos un rol.",
    }),

    theirPastor: z.string().optional(),
    theirCopastor: z.string().optional(),
    theirSupervisor: z.string().optional(),
    theirFamilyHouse: z.string().optional(),

    isActive: z.string(z.enum(['active', 'inactive'], {
      required_error: "Por favor seleccione una opción.",
    })).optional(),
    
  })
  .refine(
    (data) => {
      if (data.roles.includes(MemberRoles.Copastor) && data.roles.includes(MemberRoles.Member)) {
        return !!data.theirPastor; /* //verifica si hay un valor en theirPastor, y manda true o false */
      }
      return true;
    },
    {
      message: 'Es necesario asignar un Pastor',
      path: ['theirPastor'],
    }
  )
  .refine(
    (data) => {
      if (data.roles.includes(MemberRoles.Supervisor) && data.roles.includes(MemberRoles.Member) ) {
        return !!data.theirCopastor; 
      }
      return true;
    },
    {
      message: 'Es necesario asignar un Co-Pastor',
      path: ['theirCopastor'],
    }
  )
  .refine(
    (data) => {
      if ((data.roles.includes(MemberRoles.Preacher) && data.roles.includes(MemberRoles.Member))|| (data.roles.includes(MemberRoles.Preacher) && data.roles.includes(MemberRoles.Member) && data.roles.includes(MemberRoles.Treasurer))) {
        return !!data.theirSupervisor;
      }
      return true;
    },
    {
      message: 'Es necesario asignar un Supervisor',
      path: ['theirSupervisor'],
    }
  )
  .refine(
    (data) => {
      if (data.roles.includes(MemberRoles.Member) && !data.roles.includes(MemberRoles.Pastor) && !data.roles.includes(MemberRoles.Copastor) && !data.roles.includes(MemberRoles.Supervisor)  && !data.roles.includes(MemberRoles.Preacher)){
        return !!data.theirFamilyHouse; 
      }
      return true;
    },
    {
      message: 'Es necesario asignar una Casa Familiar',
      path: ['theirFamilyHouse'],
    }
  )


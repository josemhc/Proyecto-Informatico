"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconSlideshow,
  IconStethoscope,
  IconUpload,
  IconUserHeart,
  IconReportMedical
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import jwt from "jsonwebtoken";
import { useRouter } from 'next/navigation';

type User = { name: string; id: string; role: string } | null;

export const SidebarComponent = ({ open, setOpen }: any) => {
  const [usuario, setUsuario] = useState<User>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        const decodeToken: any = jwt.decode(token);
        if (decodeToken) {
          const loginUser = { name: decodeToken.name, id: decodeToken.id };
          fetchUserRole(loginUser.id).then(role => {
            console.log('Role fetched:', role); // Log para verificar el rol
            setUsuario({ ...loginUser, role });
          });
        }
      }
    }
  }, []);

  const fetchUserRole = async (userId: string) => {
    const response = await fetch(`http://localhost:5000/api/users/role/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.role;
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
                router.push('/');
    try {
      const response = await fetch("http://localhost:5000/api/users/logout" , {
        method: "POST",
        credentials: "include",
      })
      if (response.ok) {
        setUsuario(null);
        window.location.href = "/"
      } else {
        console.log("Error al cerrar sesion")
      }

    }catch (error) {
      console.log(error)
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["admin", "user"], // Roles that can see this link
    },
    {
      label: "Videos ecografía 4D",
      href: "/ultrasoundMedia",
      icon: (
        <IconSlideshow className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["admin"], // Only admin can see this link
    },
    {
      label: "Conversion de videos",
      href: "/videoUpload",
      icon: (
        <IconUpload className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Medico"],
    },
    {
      label: "Registro de pacientes",
      href: "/registerPatient",
      icon: (
        <IconUserHeart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Medico"],
    },
    {
      label: "Administración",
      href: "/admin",
      icon: (
        <IconUserHeart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Admin"],
    },
    {
      label: "Pacientes",
      href: "/patients",
      icon: (
        <IconStethoscope className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Medico"],
    },
    {
      label: "Perfíl",
      href: "perfil",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Ninguno"],
    },
    {
      label: "Configuración",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Ninguno"],
    },
    {
      label: "Resultados",
      href: "patientFile",
      icon: (
        <IconReportMedical className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      roles: ["Paciente"],
    },
    {
      label: "Salír",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick:handleLogout,
      roles: ["Paciente", "Admin", "Medico"],
    },
  ];

  console.log('Usuario:', usuario); // Log para verificar el estado usuario

  return (
    <Sidebar open={open} setOpen={setOpen} animate={false}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Logo />
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              usuario && link.roles.includes(usuario.role) && (
                <SidebarLink key={idx} link={link} onClick={link.onClick}/>
              )
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: usuario?.name ?? "Nombre de Usuario no encontrado",
              href: "#",
              icon: (
                <Image
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        EcoMed4D
      </motion.span>
    </Link>
  );
};
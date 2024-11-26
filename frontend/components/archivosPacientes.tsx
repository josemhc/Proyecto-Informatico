'use client'
import { SidebarComponent } from "@/components/Sidebar";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/Input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Search } from "lucide-react"
import { useState,useEffect } from 'react';
import jwt from "jsonwebtoken";

interface Document {
  name: string
  type: string
  url: string
}

export default function Patientfile() {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] =  useState<Document[]>([])



  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No estás autenticado. Redirigiendo al login.');
          window.location.href = '/';
          return;
        }
        // Decodificar el token y establecer el usuario autenticado
        const decodedToken: any = jwt.decode(token);
        if (decodedToken) {
        }
        // Hacer la solicitud GET con las cookies incluidas
        const response = await fetch(`http://localhost:5000/api/patients/${decodedToken.email}`, {
          method: 'GET',
          credentials: 'include', // Incluir cookies en la solicitud
          headers: {
            'Content-Type': 'application/json',
          },
        });
      console.log(response)
      
      const result = await response.json();
      const files = result.fileUrls.map((fileUrl : string) => {
        const name = fileUrl.split('/').pop(); 
        const type = name?.split('.').pop();    
        return { name, type, url: fileUrl };   
      });

      setDocuments(files);

      } catch (error) {
      
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen w-full">
      <SidebarComponent open={open} setOpen={setOpen} />
      <div className="w-full h-screen p-4 pt-5"> 
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-normal">Resultados de Exámenes</h1>
        </div>
        <div className="w-full relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar documentos..." className="w-full pl-8" />
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Archivo</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell className="text-right">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" download={doc.name}>
                    <Button variant="outline" size="sm">
                      
                      Descargar
                    </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {documents.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No hay documentos disponibles
          </div>
        )}
      </div>
    </div>
  )
}
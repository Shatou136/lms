"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface iAppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({chapterId, data, courseId}: iAppProps) {

   // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
     name: data.title,
     chapterId: chapterId,
     courseId: courseId,
     description: data.description ?? undefined,
     videoKey: data.videoKey ?? undefined,
     thumbnailKey: data.thumbnailKey ?? undefined,
    },
  });

return (
    <div>
        <Link 
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href={`/admin/courses/${courseId}/edit`}>
        <ArrowLeft className="size-4" />

        <span>Go Back</span>
        </Link>

        <Card>
            <CardHeader>
            <CardTitle>Lesson Configuration</CardTitle>
            <CardDescription>
                Configure the video and description for this lesson.
            </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
            
               <form className="space-y-6">
             
             <FormField 
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                 <FormLabel>Lesson Name</FormLabel> 
                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl> 
                  <FormMessage />
                </FormItem>
              )}
             />

              <FormField 
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                 <FormLabel>Description</FormLabel> 
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl> 
                  <FormMessage />
                </FormItem>
              )}
             />

              <FormField 
              control={form.control}
              name="thumbnailKey"
              render={({field}) => (
                <FormItem>
                 <FormLabel>Thumbnail image</FormLabel> 
                  <FormControl>
                    <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    fileTypeAccepted="image"
                     />
                  </FormControl> 
                  <FormMessage />
                </FormItem>
              )}
             />

                <FormField 
              control={form.control}
              name="videoKey"
              render={({field}) => (
                <FormItem>
                 <FormLabel>Video File</FormLabel> 
                  <FormControl>
                    <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    fileTypeAccepted="video"
                     />
                  </FormControl> 
                  <FormMessage />
                </FormItem>
              )}
             />

             <Button type="submit">
              Save Lesson
             </Button>
               </form>

              </Form>
            </CardContent>
        </Card>
    </div>
);
}
import { ButtonHTMLAttributes } from "react";

import { useRouter } from "next/navigation";

import client from "@/lib/backend/client";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

import { useToast } from "@/hooks/use-toast";

import { Pencil } from "lucide-react";

interface PostWriteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: boolean;
}

const PostWriteButton = ({
  className,
  text,
  onClick,
  ...props
}: PostWriteButtonProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 기존 onClick 이벤트가 있다면 실행
    if (onClick) {
      onClick(e);
    }

    const response = await client.post("/api/v1/posts/temp");

    if (response.status !== 200) {
      toast({
        title: response.data.msg,
        variant: "destructive",
      });
    } else {
      toast({
        title: response.data.msg,
      });

      router.replace(`/post/${response.data.data.id}/edit`);
    }
  };

  return (
    <Button
      className={className}
      variant="link"
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        {text && <Text>작성</Text>}
      </div>
    </Button>
  );
};

PostWriteButton.displayName = "PostWriteButton";

export default PostWriteButton;

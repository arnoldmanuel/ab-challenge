import { Link } from '@remix-run/react';

export const SignupButton = ({ textColor, variantId }: { textColor: string, variantId: number }) => {
  const trackClick = async () => {
    await fetch("/track-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "signup", variantId: variantId }),
    });
  }
  
  return (
    <Link to="/signup" className={textColor} onClick={() => trackClick()}>SIGN UP</Link>
  );
}
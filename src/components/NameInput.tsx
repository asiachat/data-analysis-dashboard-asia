import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const NameInput = () => {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!name.trim() && !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError("Email is not valid.");
      return;
    }
    setGreeting(`Hello, ${name.trim()}! Welcome to data analysis!`);
  };

 

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Week 3: Name Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
        aria-label="form for nme submission"
          placeholder="What's your name?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
        aria-label="form for email submission"
        placeholder="What's your email?"
        value={email}
        onChange={(e) => setEmail(e.target.value)}/>
        <div className="flex justify-center gap-3">
        <Button onClick={handleSubmit}>
          Say Hello
        </Button>
        <Button onClick = {() => {setName(""); setGreeting(""); setEmail(""); setError("");}} variant="outline">
          Clear
          </Button>
          </div>
        {error && (
          <p className="text-center text-red-600 text-sm">{error}</p>
        )}
        {greeting && (
          <p className="text-center text-green-600 font-medium">{greeting}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NameInput;

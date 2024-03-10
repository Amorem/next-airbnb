"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useCountries } from "../lib/getCountries";
import { HomeMap } from "./HomeMap";
import { Button } from "@/components/ui/button";
import { CreationSubmit } from "./SubmitButtons";
import { Card, CardHeader } from "@/components/ui/card";
import { Counter } from "./Counter";

export function SearchModalComponent() {
    const [step, setStep] = useState(1)
    const [locationValue, setLocationValue] = useState("");
    const { getAllCountries } = useCountries();

    function SubmitButtonLocal() {
        if (step === 1) { return (<Button type="button" onClick={() => setStep(step + 1)}>Next</Button>) }
        else if (step === 2) { return <CreationSubmit/> }
}


    return (
        <Dialog >
            <DialogTrigger asChild>
                <div className="rounded-full py-2 px-5 border flex items-center cursor-pointer">
                    <div className="flex h-full divide-x font-medium">
                        <p>Anywhere</p>
                        <p>Any Week</p>
                        <p>Add Guests</p>
                    </div>
                    <Search className="bg-primary text-white p-1 h-8 w-8 rounded-full"/>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <form className="gap-4 flex flex-col">
                    <input type="hidden" name="country" value={locationValue} />
                    {step === 1 ? (<><DialogHeader>
                        <DialogTitle>Select a Country</DialogTitle>
                        <DialogDescription>Please choose a country</DialogDescription>
                        
                    </DialogHeader>
                    <Select
                required
                            onValueChange={(value) => setLocationValue(value)}
                            value={locationValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
                    {getAllCountries().map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.flag} {country.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
                        </Select>
                        <HomeMap locationValue={locationValue} /></>) : (<>
                            <DialogHeader>
                        <DialogTitle>Select all the info you need</DialogTitle>
                        <DialogDescription>Pick up as many filters you want</DialogDescription>
                        
                            </DialogHeader>
                            <Card>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Guest</h3>
                  <p className="text-muted-foreground text-sm">
                    How many guests do you want?
                  </p>
                </div>
                <Counter name="guest" />
              </div>
            </CardHeader>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Rooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many rooms do you have?
                  </p>
                </div>
                <Counter name="room" />
              </div>
            </CardHeader>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Bathrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many bathrooms do you have?
                  </p>
                </div>
                <Counter name="bathroom" />
              </div>
            </CardHeader>
          </Card>
                    </>)}
                    <DialogFooter>
<SubmitButtonLocal/>
                    </DialogFooter>
                    
</form>
            </DialogContent>
            </Dialog>
    )

}
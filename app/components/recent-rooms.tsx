import { LogIn, X } from "lucide-react"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "./ui/item"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"




export default function RecentRooms() {
  const recentRooms = [
    "Room 1",
    "Room 2",
    "Room 3",
  ]

  return (
    <ItemGroup className="w-sm gap-1">
      <div>Recent Rooms</div>
      {recentRooms.map(room => (
        <Item key={room} variant="outline" size={"sm"} asChild>
          <a href={`/room/:${room}`}>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{room}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button variant={"ghost"}>
                <X/>
              </Button>
            </ItemActions>
          </a>
        </Item>
      ))}
    </ItemGroup>
  )
}
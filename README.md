DevF6rge

Custom structured file format / parser framework for Dev-based applications, configuration systems, profile systems, and specialized data containers.

╔══════════╗<br>
║File Types║<br>
╚══════════╝<br>

1.[.Dev | .dev | .DEV]<br>
2.[.Master | .master]<br>
3.[.Slave | .slave]<br>
4.[.NPC | .npc]<br>
5.[.Battle | .battle]<br>
6.[.Log | .log | .LOG]<br>
7.[.Ships | .ships]<br>
8.[.Dex | .DEX | .dex]<br>
9.[.Gen | .GEN | .gen]<br>

╔══════════════════════╗<br>
║Suggested File Groups║<br>
╚══════════════════════╝<br>

These are example grouping patterns for organization/reference only.<br>
They are not required by the parser unless explicitly handled by the application.<br><br>

1.[Hp | MP | LV | EXP | Link]<br>
→ Common stat / progression grouping<br><br>

2.[Gender | Name | Size]<br>
→ Common identity / descriptor grouping<br><br>

3.[RGB=(r,g,b)]<br>
→ Example formatted value grouping<br><br>

╔════════════╗<br>
║Syntax Rules║<br>
╚════════════╝<br>

1.All categories use bracket syntax.<br>
2.Subcategories use the same syntax as main categories.<br>
3.Parser validates structure, not naming conventions.<br>
4.Group/category names are flexible unless reserved by application logic.<br>
5.Extensions are case-insensitive by default.<br>

╔══════════════╗<br>
║Basic Example║<br>
╚══════════════╝<br>

[MachineProfiles]:{
    [ControlPrime]:{
        [CPU]:{
            Model=Intel Celeron N5105
            Cores=4
        }
    }
}

╔══════════╗<br>
║Purpose║<br>
╚══════════╝<br>

DevF6rge is designed to provide a flexible structured data format for:<br>

- Configuration Files<br>
- Machine Profiles<br>
- Character/NPC Data<br>
- Battle Systems<br>
- Logging Systems<br>
- Inventory/Dex Data<br>
- Specialized Custom Data Containers<br>

╔═════╗<br>
║Notes║<br>
╚═════╝<br>

- Formatting/spacing may vary depending on implementation.<br>
- Developers may create custom reserved groups/categories.<br>
- Parser behavior can be extended per application.<br>
- This format is designed for flexibility and readability.<br>
3.[RGB=(r,g,b)]<br>
→ Example formatted value grouping<br><br>

╔═════╗<br>
║Notes║<br>
╚═════╝<br>

- File extensions are case-insensitive unless application logic overrides this.<br>
- Group names are flexible and may be customized.<br>
- Parser validates structure/syntax, not naming conventions.<br>
- These examples help maintain consistency/readability.<br>

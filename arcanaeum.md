---
Arcanaeum
---

## Game specificities

ABS: active battle system
stereoptype bot: a predefined bot with spells, e.g. fire damage dealer, healer

Desktop? Mobile?
Desktop would allow to have a nice range of spells to use and an ABS
Mobile means less effective fingers to interact with the game, ABS would be unplayable
A small turn-based game would be interesting on mobile
ABS could use spells like "dash" to dodge attacks
In ABS, players would just consume magicka else they would also need movement actions 

Multiplayer, up to 4: fill with stereotype bots if you have no friends to play with
Bots can be ordered to do things, such as focusing damages on an enemy or an ally to heal, running away from something.
If you get disconnected, your character is played by a bot.

## Spells

### Types

#### Active

Crafting slots per effect rune level:

1) Element rune lvl1
1) Element rune lvl2 * 2
1) Element rune lvl3 * 2
1) Element rune lvl4 * 4
1) Element rune lvl5 * 10 (heal any status spell)

- Deal damage on a single target
- Deal damage in a zone ()
- Put a trap on the ground
- Apply a shield
- Cure status
- Dash to a given cell
- Turn invisible
- Summon an elemental creature

Multiple effects are cast by following the entity (e.g. it moved) unless it goes out of scope (too far, behind something, too close)


#### Passive

- Increase health regeneration
- Increase magicka regeneration
- Increase movement speed
- Increase action points
- Increase item usage range
- Every 3 spells, next spell is reinforced
- Incoming {Element} damage will be absorbed
- Incoming {Element} damage will be reflected as {Element} damage
- 10% chance to reduce by {x}% incoming damage
- Grants Omniscient effect for {x} turns
- Incoming {Element} damage trigger {x}% {Spell} effect 
- Dying triggers {x}% {Spell} effect 
- Being moved triggers {Spell}
- After dying, will resurrect after {x} turns if the battle is not finished
- Turn {Element} damage into healing?

## Equipment

## Items

Items can be used during the game, have a limited range

Health Potions
Magicka Potions
Effect items: create

## Currencies

Should resources be used to craft runes or as payment to create a spell?

## Modes

### Campaign

Story mode?

Begin a game: start with multiple powerful spells

Once a powerful elementalist, the essence of your power got stolen by a wicked creature. Many other elementalists had the same fate.

In order to regain your powers, you need to receive the blessing of the elements again.

### Elemental Circles

The ten elements are displayed on successive circles: each level increases the difficulty and lets player get resources for crafting runes.

### PvP

## Combat Mechanics

Elements don't have weaknesses: this property belongs to a monster/player only.

pick a spell
highlight spell scope with a thick radius around the player
mouseover highlights target cell(s) 

AoE will trigger effects from inner to outer. Say we have a 3*3 AoE, the target cell (at the center) is first, then the middle level and the outer:
| | | |    | |X| |    |X| |X|
| |X| | => |X| |X| => | | | |
| | | |    | |X| |    |X| |X|

It means that if the first target hit dies and should trigger another spell, it is the next to be executed.
Only the active spell may trigger another effect. 
It means that if a player can heal when hit and takes 1 active then 3 passive effects, only the first effect may trigger the passive, still following the above order.

### Statuses

<!-- Statuses have levels, depending on the spell level.
It's still possible to heal a status from a higher level than a heal spell but probability will be lower. -->

Elemental
- Fire: Burning => take damage each turn and illuminate surrounding cases
- Water: Mutism => cannot cast a spell
- Earth: Petrified => cannot do any action until cured (takes 3 turns to turn into - stone)
- Wind: Slow => movement is reduced
- Sandstorm: Blind => UI becomes blurry (at least the field), AI should remember or deduce where you were or do a defensive action
- Metal: Bleeding => take damage each turn
- Blizzard: Frozen => cannot do any action for some turns 
- Lightning: Stunned => cannot do any action for some turns
- Wood: Root => cannot move for some turns
- Steam: Heat => take additional Fire damage

Other
- Coma => entity is inactive unless resurrected; can still be moved
- Invisible => turn invisible for some turns
- Unbalanced
- Poison => take damage each turn
- Omniscient => immunize against Blind status and allows to see whatever other players see

### Environment Interactivity

- Fire => burn wooden bushes/torches
- Water => create liquid surfaces
- Earth => move rock blocks
- Wind => move light targets
- Sandtorm => create quicksands
- Metal => move metal blocks
- Blizzard => create icy surfaces
- Lightning => electrify targets
- Wood => root targets
- Steam => create steam "blocks"*

*Steam can be removed when a metal or rock block reaches an occupied cell or when a wind spell blows an occupied cell.

### Scope & Fog of War

Maps that haven't been visited are blackened by a FoW.

Players have a scope: they can't see farther a certain point and cannot see through physical objects.
They cannot see what the others see.
Players may use a hint to warn their position 

## Spell Crafting

### Effect Crafter

Effect = Action + Target

Action:
repulse
attract
deal damage
cure status

Target:
ally
enemy
any

Visual effect editor: lets crafters define what cells can be targetted (only working with area of effect ones)

### Effects Mixer

A new effect can be made from two effects, but the final effect will not be as powerful as a single one.
During the creation phase, a modifying rune can be added to the mix to provide additional effect.

deal elemental damage to a target
set an elemental shield to a target
set an elemental trap to a target
apply status to a target
cure status to a target
move a target away of the player
drag a target towards the player
deal elemental damage in a target zone
deal elemental damage around the player
set elemental shields in a target zone
set elemental shields around the player
set elemental traps in a target zone
set elemental traps around the player
teleport the player to a target
exchange place with a target

### Modifiers 

Modifiers that improve the final effect should also come at a cost, like increasing spell cost or cooldown turns.

reduce spell cost 
nullify sight requirement
improve casting/effect scope
reduce cooldown
fortify first effect
fortify second effect 

### Spells

1 rune slot per effect
Basic effect = 1
Created effect = 2

Spell = effect (basic or created) + rune(s)

## Equipment

Sets allow to get Element resistances/weaknesses





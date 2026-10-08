"""The fires never wait on matches: matches, the brass lighter, or one last match."""
import harness
from harness import Game
g = Game()
base = "(set: $sobriety to 20)(set: $blackouts to 1)(set: $hutBurnt to false)(set: $coachBurnt to false)"
for label, seed in (("none", "(set: $hasMatches to false)(set: $dreamKey to \"\")"),
                    ("lighter", "(set: $hasMatches to false)(set: $dreamKey to \"lighter\")"),
                    ("matches", "(set: $hasMatches to true)(set: $dreamKey to \"\")")):
    p = g.page("Alley: Soho Square", base + seed); Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
    has_link = p.evaluate("() => [...document.querySelectorAll('tw-link')].some(l=>l.textContent.includes('cross the garden'))")
    p = g.page("Soho Square: the hut", base + seed); Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(4000)
    door = p.evaluate("() => document.querySelector('[data-sq-copy=door]').textContent.trim()")
    light = p.evaluate("() => !!document.querySelector('[data-sq-action=light] tw-link')")
    print(label, "| hut link:", has_link, "| light it:", light, "| door:", door, "| errors", p.locator("tw-error").count())

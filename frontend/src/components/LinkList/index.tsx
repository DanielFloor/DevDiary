import type { LinkType } from '../../api/client'

interface LinkListProps {
  links: LinkType[]
}

export default function LinkList({ links }: LinkListProps) {
  if (!links || links.length === 0) return null

  return (
    <ul className="mt-2 space-y-1">
      {links.map((link, i) => (
        <li key={link.id ?? i}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-all dark:text-blue-400"
          >
            {link.label || link.url}
          </a>
        </li>
      ))}
    </ul>
  )
}


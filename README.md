### Data Mock
#
#### Products
```bash
https://json-generator.com/
```
```json
[
  '{{repeat(5, 7)}}',
  {
    _id: '{{objectId()}}',
    index: '{{index()}}',
    guid: '{{guid()}}',
    description: '{{lorem(1, "paragraphs")}}',
    price: '{{floating(1000, 4000, 2, "$0,0.00")}}',
    name: '{{lorem(1, "words")}}',
    image: 'https://placehold.co/600x400'
    
  }
]
```
## ADMIN ACCESS

 "email": "carla@test.com",
  "password": "123456"
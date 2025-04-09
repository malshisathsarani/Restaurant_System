<?php

namespace App\Repositories\All\Items;

use App\Models\Item;
use App\Repositories\Base\BaseRepository;

class ItemRepository extends BaseRepository implements ItemInterface
{
    /**
     * @var Item
     */
    protected $model;

    /**
     * ItemRepository constructor.
     *
     * @param Item $model
     */
    public function __construct(Item $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }
}
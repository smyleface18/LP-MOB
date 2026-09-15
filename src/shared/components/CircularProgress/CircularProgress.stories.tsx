import type { Meta, StoryObj } from "@storybook/react";
import { CircularProgress } from "./CircularProgress.component";



const meta = {
    title: 'Atoms/CircularProgress',
    component: CircularProgress,
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;




export const Primary: Story = {
    args: {
        percentage: 50,
        label: 'vocabulario',
    }
}
